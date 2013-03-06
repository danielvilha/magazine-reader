#import "ApplicationMods.h"

@implementation ApplicationMods

+ (NSArray*) compiledMods
{
	NSMutableArray *modules = [NSMutableArray array];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"compression",@"name",@"ti.compression",@"moduleid",@"1.0",@"version",@"c129f5f7-ace8-4cca-be47-b226f8b29f78",@"guid",@"",@"licensekey",nil]];
	return modules;
}

@end